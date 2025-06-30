export { default as Certificate } from './components/certificate';
export { default as GenerateCertificate } from './pages/generate-certificate';
export { certificateService } from './services/certificate.service';
export { useCertificate } from './hooks/use-certificate';
export type {
  CertificateData,
  CertificateRequest,
} from './services/certificate.service';
