## SSL Certificate Generation

The server uses HTTPS for secure communication. You need to generate SSL certificates before starting the server.

### Automatic Generation

The server includes a script to automatically generate SSL certificates:

```bash
npm run generate-certs
```

This will create a `certificates` directory with the necessary SSL files.
