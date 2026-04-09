from django.db import models
from django.contrib.auth.models import AbstractUser

class UsuarioCustom(AbstractUser):
    ROLES = [
        ('ADMIN', 'Administrador'),
        ('ENFERMERO', 'Personal de Enfermería'),
    ]
    rol = models.CharField(max_length=20, choices=ROLES, default='ENFERMERO')
    registro_profesional = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
