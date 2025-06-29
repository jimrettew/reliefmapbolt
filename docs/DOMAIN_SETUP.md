# ReliefMap Domain Setup - reliefmap.org

## DNS Configuration

**Primary Domain:**
```
Type: A
Name: @ 
Value: 75.2.60.5
```

**www Redirect:**
```
Type: CNAME
Name: www
Value: reliefmap.org
```

**Alternative CNAME:**
```
Type: CNAME
Name: @
Value: your-netlify-site.netlify.app
```

## Required Files
- `public/CNAME` - Custom domain
- `public/_redirects` - SPA routing
- `netlify.toml` - Build config

## URLs
- Production: https://reliefmap.org
- Check DNS: `nslookup reliefmap.org` 