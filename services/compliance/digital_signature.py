"""Integration helpers for ICP-Brasil digital signatures."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Optional

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import pkcs12


@dataclass(frozen=True)
class ICPBrasilCertificate:
    """Metadata extracted from an ICP-Brasil certificate."""

    subject: str
    issuer: str
    serial_number: str
    valid_from: datetime
    valid_to: datetime


class ICPBrasilDigitalSignature:
    """Utility to sign and verify data using ICP-Brasil compatible certificates."""

    def __init__(self, private_key, certificate: x509.Certificate, chain: Iterable[x509.Certificate]):
        self._private_key = private_key
        self._certificate = certificate
        self._chain = list(chain) if chain else []

    @classmethod
    def from_pkcs12(
        cls, source: bytes | str | Path, password: Optional[str | bytes] = None
    ) -> "ICPBrasilDigitalSignature":
        """Load a PKCS#12 bundle from bytes or filesystem path."""

        if isinstance(source, (str, Path)):
            data = Path(source).read_bytes()
        else:
            data = source
        if isinstance(password, str):
            password_bytes = password.encode("utf-8")
        else:
            password_bytes = password
        private_key, certificate, additional_certs = pkcs12.load_key_and_certificates(data, password_bytes)
        if private_key is None or certificate is None:
            raise ValueError("Pacote PKCS#12 inválido ou senha incorreta")
        return cls(private_key, certificate, additional_certs or [])

    def sign(self, payload: bytes) -> bytes:
        """Sign the payload using the private key."""

        return self._private_key.sign(
            payload,
            padding.PKCS1v15(),
            hashes.SHA256(),
        )

    def verify(self, signature: bytes, payload: bytes) -> None:
        """Verify a signature against the loaded certificate."""

        self._certificate.public_key().verify(
            signature,
            payload,
            padding.PKCS1v15(),
            hashes.SHA256(),
        )

    def certificate_metadata(self) -> ICPBrasilCertificate:
        """Return certificate metadata for logging and validation purposes."""

        cert = self._certificate
        return ICPBrasilCertificate(
            subject=cert.subject.rfc4514_string(),
            issuer=cert.issuer.rfc4514_string(),
            serial_number=hex(cert.serial_number),
            valid_from=cert.not_valid_before,
            valid_to=cert.not_valid_after,
        )

    def export_public_certificate(self) -> bytes:
        """Export the certificate in PEM format for distribution."""

        return self._certificate.public_bytes(serialization.Encoding.PEM)


__all__ = ["ICPBrasilCertificate", "ICPBrasilDigitalSignature"]
