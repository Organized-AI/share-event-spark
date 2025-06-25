-- Fix function search path security warnings
-- This migration addresses Supabase security warnings by setting SECURITY DEFINER 
-- and fixed search_path for all affected functions

-- 1. Fix can_access_folder function
CREATE OR REPLACE FUNCTION public.can_access_folder(event_uuid uuid, user_uuid uuid, folder text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_result user_role;
BEGIN
    -- Get the user's role in the event
    SELECT get_user_role_in_event(event_uuid, user_uuid) INTO user_role_result;
    
    -- If user has no role, deny access
    IF user_role_result IS NULL THEN
        RETURN false;
    END IF;
    
    -- Organizers can access all folders
    IF user_role_result = 'organizer' THEN
        RETURN true;
    END IF;
    
    -- Role-based folder access control
    CASE folder
        WHEN 'speakers' THEN
            RETURN user_role_result IN ('organizer', 'speaker');
        WHEN 'sponsors' THEN
            RETURN user_role_result IN ('organizer', 'sponsor');
        WHEN 'attendees' THEN
            RETURN user_role_result IN ('organizer', 'attendee', 'speaker', 'sponsor', 'volunteer');
        WHEN 'volunteers' THEN
            RETURN user_role_result IN ('organizer', 'volunteer');
        WHEN 'atmosphere' THEN
            RETURN true; -- All roles can access atmosphere content
        WHEN 'ai-content' THEN
            RETURN user_role_result IN ('organizer', 'speaker');
        ELSE
            RETURN false;
    END CASE;
END;
$$;

-- 2. Fix can_user_modify_role function
CREATE OR REPLACE FUNCTION public.can_user_modify_role(event_uuid uuid, user_uuid uuid, target_user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_result user_role;
    target_user_role user_role;
BEGIN
    -- Get the user's role in the event
    SELECT get_user_role_in_event(event_uuid, user_uuid) INTO user_role_result;
    
    -- Get the target user's role in the event
    SELECT get_user_role_in_event(event_uuid, target_user_uuid) INTO target_user_role;
    
    -- Only organizers can modify roles
    IF user_role_result != 'organizer' THEN
        RETURN false;
    END IF;
    
    -- Organizers cannot modify other organizers (prevent privilege escalation)
    IF target_user_role = 'organizer' AND user_uuid != target_user_uuid THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;

-- 3. Fix check_luma_rate_limit function
CREATE OR REPLACE FUNCTION public.check_luma_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    recent_calls_count integer;
    rate_limit_window interval := '1 hour';
    max_calls_per_hour integer := 100;
BEGIN
    -- Count API calls in the last hour for this user
    SELECT COUNT(*)
    INTO recent_calls_count
    FROM luma_api_usage
    WHERE user_id = user_uuid
    AND created_at > NOW() - rate_limit_window;
    
    -- Return true if under the limit, false if over
    RETURN recent_calls_count < max_calls_per_hour;
END;
$$;

-- 4. Fix decrypt_api_key function
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Use Supabase's built-in decryption with the vault
    -- This assumes you have set up encryption keys in Supabase vault
    RETURN vault.decrypt(encrypted_key::bytea, 'luma-api-key')::text;
EXCEPTION
    WHEN OTHERS THEN
        -- Return null if decryption fails
        RETURN NULL;
END;
$$;

-- 5. Fix encrypt_api_key function
CREATE OR REPLACE FUNCTION public.encrypt_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Use Supabase's built-in encryption with the vault
    -- This assumes you have set up encryption keys in Supabase vault
    RETURN encode(vault.encrypt(api_key::bytea, 'luma-api-key'), 'base64');
EXCEPTION
    WHEN OTHERS THEN
        -- Return null if encryption fails
        RETURN NULL;
END;
$$;

-- 6. Fix get_user_role_in_event function
CREATE OR REPLACE FUNCTION public.get_user_role_in_event(event_uuid uuid, user_uuid uuid)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    role_result user_role;
BEGIN
    SELECT role
    INTO role_result
    FROM event_users
    WHERE event_id = event_uuid
    AND user_id = user_uuid;
    
    RETURN role_result;
END;
$$;

-- 7. Create update_permissions_for_role function (this was missing)
CREATE OR REPLACE FUNCTION public.update_permissions_for_role(event_uuid uuid, user_uuid uuid, new_role user_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the user has permission to modify roles
    IF NOT can_user_modify_role(event_uuid, user_uuid, user_uuid) THEN
        RETURN false;
    END IF;
    
    -- Update the user's role in the event
    UPDATE event_users
    SET role = new_role,
        updated_at = NOW()
    WHERE event_id = event_uuid
    AND user_id = user_uuid;
    
    -- Return true if the update was successful
    RETURN FOUND;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.can_access_folder(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_user_modify_role(uuid, uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_luma_rate_limit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrypt_api_key(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.encrypt_api_key(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_in_event(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_permissions_for_role(uuid, uuid, user_role) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.can_access_folder IS 'Checks if a user can access a specific folder in an event based on their role';
COMMENT ON FUNCTION public.can_user_modify_role IS 'Checks if a user has permission to modify another user''s role in an event';
COMMENT ON FUNCTION public.check_luma_rate_limit IS 'Checks if a user has exceeded the Luma API rate limit';
COMMENT ON FUNCTION public.decrypt_api_key IS 'Decrypts an encrypted API key using Supabase vault';
COMMENT ON FUNCTION public.encrypt_api_key IS 'Encrypts an API key using Supabase vault';
COMMENT ON FUNCTION public.get_user_role_in_event IS 'Gets a user''s role in a specific event';
COMMENT ON FUNCTION public.update_permissions_for_role IS 'Updates a user''s role permissions in an event';