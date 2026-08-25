# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in HolyMind, please **do not** open a public GitHub issue. Instead, please report it responsibly to the maintainers.

### How to Report

1. **Email**: Contact the maintainers directly at their GitHub profiles:
   - [@EnzoHashinokutiXavier](https://github.com/EnzoHashinokutiXavier)
   - [@Augustbr01](https://github.com/Augustbr01)

2. **Include in your report**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

3. **Timeline**: We aim to respond within 7 days and will work toward a fix promptly

## Security Considerations

### API Key Management
- **Never** commit `.env` files or API keys to the repository
- Always use `.env.example` as a template
- Rotate API keys if exposed

### Privacy
HolyMind prioritizes user privacy:
- No persistent user data is stored on the server
- Conversations are not logged
- PDFs are not distributed to ensure compliance

### Dependencies
Keep dependencies updated:
```bash
pip install --upgrade -r requirements.txt
```

## Vulnerability Disclosure

Once a vulnerability is fixed, we will:
1. Release a patched version
2. Credit the reporter (unless anonymity is requested)
3. Provide clear upgrade instructions

Thank you for helping keep HolyMind secure! 🔒
