# Human-Robot Handshake Animation Prompts for Texel.ai

*Optimized for Hunyuan Video, Wan 2.1, LTXV, and Framepack on Texel.ai platform*

## Hunyuan Video - Cinematic Human-Robot Partnership

### Corporate AI Integration Handshake
```
Professional business executive in tailored navy suit extends hand toward advanced humanoid robot with sleek metallic design and glowing blue accents. The human shows confidence and curiosity while the robot demonstrates perfect mechanical precision in reciprocating the handshake. Moment represents the historic partnership between human intelligence and artificial intelligence. Modern corporate boardroom with holographic displays and futuristic technology visible in background. Cinematic lighting emphasizes the contrast between organic human skin and polished robotic components. Camera captures this milestone moment with smooth tracking shot, highlighting both the human's natural warmth and the robot's technological sophistication.
```

### Negative Prompt
```
poor hand anatomy, unrealistic robot design, clunky movements, harsh lighting, amateur composition, low quality metal textures, unconvincing AI design, robotic stiffness in human
```

---

## Wan 2.1 - Premium Quality Tech Partnership

### Next-Generation AI Collaboration
```
Distinguished technology executive in elegant business attire engages in groundbreaking handshake with state-of-the-art android featuring premium metallic finish, articulated finger joints, and sophisticated LED indicators. The interaction demonstrates perfect harmony between human intuition and artificial precision. Exceptional detail rendering shows fabric textures on human clothing contrasted with polished chrome and carbon fiber components of the robot. High-end technology laboratory setting with advanced equipment and holographic interfaces. Museum-quality visual fidelity captures every detail of this historic moment where human leadership meets artificial intelligence. Professional photography lighting emphasizes material contrasts and technological advancement.
```

### Negative Prompt
```
poor material quality, unconvincing robot design, low detail rendering, artificial lighting, amateur robotics appearance, unclear hand positioning, blurred technological elements
```

---

## LTXV - Fast Human-AI Interaction

### Quick Tech Demonstration
```
Business professional shakes hands with sleek robot in modern tech showcase. Human in professional attire meets advanced android with metallic finish and glowing elements. Clean handshake interaction in simple tech environment. Clear focus on human-robot connection moment.
```

### Negative Prompt
```
complex background, multiple characters, overdetailed scene, poor hand anatomy, unrealistic robot, blurred motion, slow movement
```

---

## Framepack - Progressive Human-Robot Animation

### Starting Image Setup
- Human executive positioned to greet humanoid robot
- Professional business setting with advanced technology
- Clear composition showing both human and robotic elements
- Appropriate lighting highlighting material contrasts
- Both subjects positioned for natural handshake interaction

### Animation Prompt
```
Technology leader approaches advanced humanoid robot for historic first handshake between company CEO and AI assistant. Progressive frame-by-frame animation shows initial human curiosity, robot's precise movement initiation, the moment of contact between flesh and metal, firm professional handshake duration, and the meaningful conclusion representing successful human-AI partnership. Smooth progression emphasizes the significance of this technological milestone while maintaining natural human movement and precise robotic mechanics throughout the sequence.
```

### Negative Prompt
```
jerky robot movements, unnatural human behavior, poor material rendering, frame inconsistency, unconvincing AI design, rushed interaction timing
```

---

## Platform-Specific Optimization for Texel.ai

### Hunyuan Video on Texel.ai
- **Focus**: Cinematic quality and technological sophistication
- **Strength**: Multi-character scenes (human + robot interaction)
- **Lighting**: Professional, cinematic setup emphasizing material contrasts
- **Environment**: High-tech corporate or laboratory settings

### Wan 2.1 on Texel.ai
- **Focus**: Exceptional detail in both human and robotic elements
- **Strength**: Material rendering and texture quality
- **Lighting**: Museum-quality visual fidelity
- **Environment**: Premium technology showcases and executive settings

### LTXV on Texel.ai
- **Focus**: Clean, fast generation of human-robot interaction
- **Strength**: Quick iteration for concept development
- **Lighting**: Simple, clear illumination
- **Environment**: Streamlined tech environments

### Framepack on Texel.ai
- **Focus**: Frame-by-frame progression of historic moment
- **Strength**: Detailed animation control and emotional storytelling
- **Lighting**: Consistent throughout animation sequence
- **Environment**: Significant technology milestone settings

## Universal Human-Robot Handshake Elements

### Human Characteristics
- "Professional business executive"
- "Technology leader" 
- "Distinguished corporate figure"
- "Confident and curious expression"
- "Natural human warmth"

### Robot Design Keywords
- "Advanced humanoid robot"
- "Sleek metallic design"
- "Articulated finger joints"
- "Glowing LED indicators"
- "Polished chrome components"
- "Sophisticated AI design"

### Material Contrasts
- "Organic human skin versus polished metal"
- "Fabric textures contrasted with robotic components"
- "Natural warmth meeting technological precision"
- "Human intuition and artificial intelligence harmony"

### Technological Settings
- "Modern corporate boardroom with holographic displays"
- "High-end technology laboratory"
- "Advanced tech showcase environment"
- "Futuristic business setting"

## Negative Prompts for All Models

### Universal Avoids
```
poor hand anatomy, unrealistic robot design, clunky robotic movements, unconvincing AI appearance, amateur composition, harsh lighting, low quality metal textures, blurred technological elements, robotic stiffness in human character, unclear material contrasts
```

### Quality Issues to Prevent
- Unconvincing robot design or movement
- Poor material rendering (metals, fabrics, skin)
- Unnatural human-robot interaction timing
- Amateur technological environment
- Inconsistent lighting on different materials
- Low-quality mechanical details

## Texel.ai API Integration Guide

### Available Models and Specifications

#### Video Generation Models
- **"framepack"** (default) - High-quality video generation with detailed frame control
- **"ltxv"** - Cinematic video results with fast processing
- **"wan"** - Smooth motion generation with premium quality
- **"hunyuan"** - Advanced video model for complex scenes

#### Image Generation Models
- **"Realistic"** (default) - Photorealistic human-robot interactions
- **"Anime"** - Stylized illustration approach for creative interpretations

### Optimal Generation Parameters for Human-Robot Handshakes

#### For Development/Testing
```python
# Fast iteration settings
{
    "width": 512,
    "height": 512,
    "steps": 10,
    "cfg_scale": 7.5,
    "model": "ltxv"  # Fastest video generation
}
```

#### For Production Quality
```python
# High-quality final output
{
    "width": 1024,
    "height": 768,
    "steps": 20,
    "cfg_scale": 8.0,
    "model": "framepack"  # Best detail control
}
```

### API Usage Examples

#### Basic Image Generation
```python
from texel_api import TexelAPI

client = TexelAPI(api_key="your_api_key")

# Generate starting frame for handshake
response = client.generate_image(
    prompt="Professional business executive extends hand toward advanced humanoid robot with sleek metallic design and glowing blue accents",
    negative_prompt="poor hand anatomy, unrealistic robot design, clunky movements",
    width=1024,
    height=768,
    steps=15,
    model="realistic"
)
```

#### Video Generation from Image
```python
# Create handshake animation from starting image
video_response = client.generate_video(
    prompt="Technology leader approaches advanced humanoid robot for historic first handshake, smooth progressive animation",
    image_url=response.image_url,
    model="framepack",
    duration=5  # seconds
)

# Check generation status (video takes 2-10 minutes)
status = client.check_status(video_response.job_id)
```

### Performance Optimization Strategies

#### Development Phase
1. **Use smaller dimensions** (512x512) for rapid prototyping
2. **Reduce inference steps** (8-12) to accelerate iteration
3. **Choose LTXV model** for fastest video generation
4. **Generate multiple seeds** for variation testing

#### Production Phase
1. **Increase dimensions** (1024x768 or higher) for final quality
2. **Optimize steps** (15-25) for quality/speed balance
3. **Use Framepack model** for maximum detail control
4. **Implement proper error handling** for API timeouts

### Error Handling and Rate Limits

```python
import time
import random

def robust_generation(client, prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = client.generate_image(prompt=prompt)
            return result
        except APIError as e:
            if e.status_code == 429:  # Rate limit
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Max retries exceeded")
```

### Security Best Practices

1. **Protect API keys** - Use environment variables
2. **Validate inputs** - Sanitize prompts before API calls
3. **Monitor usage** - Track API calls and costs
4. **Handle timeouts** - Implement proper async handling for video generation

### Cost Optimization Tips

1. **Batch similar requests** to reduce API overhead
2. **Cache successful generations** to avoid re-generating
3. **Use appropriate model selection** based on quality needs
4. **Monitor generation quotas** and implement usage limits

## Pro Tips for Texel.ai Human-Robot Handshakes

### Technical Implementation
1. **Start with image generation** - Create perfect starting frame first
2. **Use seed control** - Maintain consistency across variations
3. **Monitor generation time** - Video can take 2-10 minutes
4. **Implement status checking** - Handle asynchronous video generation
5. **Error recovery** - Graceful handling of API failures

### Creative Optimization
6. **Emphasize material contrast** - Human skin vs robotic components
7. **Technology significance** - Frame as historic human-AI milestone
8. **Professional context** - Corporate/business settings work best
9. **Lighting for materials** - Highlight both organic and metallic elements
10. **Movement precision** - Human natural, robot mechanical but smooth
11. **Scale appropriately** - Human and robot should be proportional
12. **Environmental context** - Advanced technology settings enhance believability
13. **Emotional storytelling** - Represent hope, progress, partnership
14. **Technical details** - Include believable robotic elements (LEDs, joints, etc.)
15. **Quality balance** - Match human realism with convincing robot design