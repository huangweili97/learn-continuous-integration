import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const generateCertificates = () => {
  const certPath = path.join(__dirname, '..', 'certificates');

  // Create certificates directory if it doesn't exist
  if (!fs.existsSync(certPath)) {
    fs.mkdirSync(certPath, { recursive: true });
  }

  try {
    // Generate private key
    execSync('openssl genrsa -out certificates/private.key 2048', {
      cwd: path.join(__dirname, '..')
    });

    // Generate CSR
    execSync(
      'openssl req -new -key certificates/private.key -out certificates/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"',
      { cwd: path.join(__dirname, '..') }
    );

    // Generate self-signed certificate
    execSync(
      'openssl x509 -req -days 365 -in certificates/certificate.csr -signkey certificates/private.key -out certificates/certificate.crt',
      { cwd: path.join(__dirname, '..') }
    );

    console.log('SSL certificates generated successfully in the certificates directory');
  } catch (error) {
    console.error('Error generating certificates:', error);
    process.exit(1);
  }
};

generateCertificates();