# Supabase Security Warnings Fix Plan

## Overview
This document outlines the step-by-step plan to fix 9 Supabase security warnings in order of priority.

## Warnings Summary
- **7 High Priority**: Function Search Path Mutable (Security vulnerabilities)
- **2 Medium Priority**: Auth configuration improvements

---

## Phase 1: Database Function Security Fixes (High Priority)

### ✅ Step 1: Created Migration File
**File**: `supabase/migrations/20250625000001_fix_function_search_path.sql`

This migration fixes all 7 function security warnings by:
- Adding `SECURITY DEFINER` clause
- Setting fixed `search_path = public`
- Implementing proper function logic
- Adding documentation comments

### 🔄 Step 2: Apply Migration
```bash
cd /Users/supabowl/Downloads/Cursor/Event\ Content\ Tool/share-event-spark
supabase db reset
# OR
supabase migration up
```

### 🧪 Step 3: Test Each Function
After applying the migration, test each function:

#### Test 1: can_access_folder
```sql
SELECT can_access_folder('your-event-uuid', 'your-user-uuid', 'speakers');
```

#### Test 2: can_user_modify_role
```sql
SELECT can_user_modify_role('your-event-uuid', 'your-user-uuid', 'target-user-uuid');
```

#### Test 3: check_luma_rate_limit
```sql
SELECT check_luma_rate_limit('your-user-uuid');
```

#### Test 4: encrypt_api_key
```sql
SELECT encrypt_api_key('test-api-key');
```

#### Test 5: decrypt_api_key
```sql
SELECT decrypt_api_key(encrypt_api_key('test-api-key'));
```

#### Test 6: get_user_role_in_event
```sql
SELECT get_user_role_in_event('your-event-uuid', 'your-user-uuid');
```

#### Test 7: update_permissions_for_role
```sql
SELECT update_permissions_for_role('your-event-uuid', 'your-user-uuid', 'attendee');
```

---

## Phase 2: Auth Configuration Fixes (Medium Priority)

### 🔄 Step 4: Fix OTP Expiry
**Location**: Supabase Dashboard > Authentication > Settings > Email Provider

**Current Issue**: OTP expiry set to more than 1 hour
**Fix**: Set OTP expiry to 30 minutes (1800 seconds)

**Steps**:
1. Go to Supabase Dashboard
2. Navigate to Authentication > Settings
3. Find "Email Provider" section
4. Set "OTP Expiry" to 1800 seconds (30 minutes)
5. Click "Save"

### 🔄 Step 5: Enable Leaked Password Protection
**Location**: Supabase Dashboard > Authentication > Settings > Password Security

**Current Issue**: Leaked password protection disabled
**Fix**: Enable HaveIBeenPwned integration

**Steps**:
1. Go to Supabase Dashboard
2. Navigate to Authentication > Settings
3. Find "Password Security" section
4. Enable "Leaked Password Protection"
5. Click "Save"

---

## Testing & Verification Plan

### Database Function Tests
1. **Apply migration**
2. **Run Supabase linter** to verify warnings are resolved
3. **Test each function individually**
4. **Run integration tests** with your event management features
5. **Check application functionality** remains intact

### Auth Configuration Tests
1. **Test OTP email flows** (signup, password reset)
2. **Verify OTP expires in 30 minutes**
3. **Test password creation** with common passwords
4. **Verify leaked passwords are rejected**

---

## Commands to Run

### 1. Apply Database Migration
```bash
cd "/Users/supabowl/Downloads/Cursor/Event Content Tool/share-event-spark"
supabase migration up
```

### 2. Verify Migration Applied
```bash
supabase db diff --schema public
```

### 3. Run Linter to Check Warnings
```bash
supabase db lint
```

### 4. Test Application
```bash
npm run dev
```

---

## Success Criteria

### ✅ Phase 1 Complete When:
- [ ] Migration applied successfully
- [ ] All 7 function warnings resolved in linter
- [ ] All functions return expected results in tests
- [ ] Application features work correctly

### ✅ Phase 2 Complete When:
- [ ] OTP expiry set to 30 minutes
- [ ] Leaked password protection enabled
- [ ] Auth warnings resolved in linter
- [ ] Authentication flows work correctly

---

## Rollback Plan

If issues occur:

### Database Functions
```bash
# Rollback migration
supabase migration down
```

### Auth Settings
- Manually revert settings in Supabase Dashboard
- OTP expiry back to previous value
- Disable leaked password protection if needed

---

## Notes

- **Backup recommended** before applying changes
- **Test in staging** environment first if available
- **Monitor application logs** during deployment
- **Verify all event management features** still work after changes

## Dependencies

- Supabase CLI installed and configured
- Database access credentials
- Supabase Dashboard admin access
- Node.js/npm for testing application