import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * This script generates SSL certificates for the server.
 * It creates a certificates directory if it doesn't exist,
 * and generates a private key and a self-signed certificate.
 */

const CERT_DIR = path.join(__dirname, 'certificates');
const KEY_PATH = path.join(CERT_DIR, 'private.key');
const CERT_PATH = path.join(CERT_DIR, 'certificate.crt');

// Check if certificates already exist
const checkCertificates = () => {
  if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
    console.log('SSL certificates already exist.');
    return true;
  }
  return false;
};

// Create certificates directory if it doesn't exist
const createCertDir = () => {
  if (!fs.existsSync(CERT_DIR)) {
    console.log('Creating certificates directory...');
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }
};

// Generate private key
const generatePrivateKey = () => {
  console.log('Generating private key...');
  try {
    execSync(`openssl genrsa -out "${KEY_PATH}" 2048`);
    console.log('Private key generated successfully.');
    return true;
  } catch (error) {
    console.error('Error generating private key:', error);
    return false;
  }
};

// Generate certificate signing request
const generateCSR = () => {
  console.log('Generating certificate signing request...');
  try {
    execSync(`openssl req -new -key "${KEY_PATH}" -out "${path.join(CERT_DIR, 'certificate.csr')}" -subj "/CN=localhost"`);
    console.log('Certificate signing request generated successfully.');
    return true;
  } catch (error) {
    console.error('Error generating certificate signing request:', error);
    return false;
  }
};

// Generate self-signed certificate
const generateCertificate = () => {
  console.log('Generating self-signed certificate...');
  try {
    execSync(`openssl x509 -req -days 365 -in "${path.join(CERT_DIR, 'certificate.csr')}" -signkey "${KEY_PATH}" -out "${CERT_PATH}"`);
    console.log('Self-signed certificate generated successfully.');
    return true;
  } catch (error) {
    console.error('Error generating self-signed certificate:', error);
    return false;
  }
};

// Clean up temporary files
const cleanup = () => {
  const csrPath = path.join(CERT_DIR, 'certificate.csr');
  if (fs.existsSync(csrPath)) {
    fs.unlinkSync(csrPath);
    console.log('Temporary files cleaned up.');
  }
};

// Main function
const generateCertificates = () => {
  console.log('Starting SSL certificate generation...');
  
  if (checkCertificates()) {
    return;
  }
  
  createCertDir();
  
  if (!generatePrivateKey()) {
    console.error('Failed to generate private key. Aborting.');
    return;
  }
  
  if (!generateCSR()) {
    console.error('Failed to generate certificate signing request. Aborting.');
    return;
  }
  
  if (!generateCertificate()) {
    console.error('Failed to generate self-signed certificate. Aborting.');
    return;
  }
  
  cleanup();
  
  console.log('SSL certificate generation completed successfully.');
  console.log(`Private key: ${KEY_PATH}`);
  console.log(`Certificate: ${CERT_PATH}`);
};

// Run the script
generateCertificates(); 