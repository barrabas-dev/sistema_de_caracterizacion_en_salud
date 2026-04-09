from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado que intercepta la generación del token
    para inyectar datos extra (claims) del usuario de forma segura.
    """
    @classmethod
    def get_token(cls, user):
        # Genera el token estándar (contiene el id de usuario por defecto)
        token = super().get_token(user)

        # Inyectar propiedades personalizadas al payload del Token
        token['username'] = user.username
        token['rol'] = user.rol
        
        # Como "registro_profesional" es blank/null, solo lo inyectamos si contiene un valor
        if user.registro_profesional:
            token['registro_profesional'] = user.registro_profesional

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada que utiliza el serializador anterior 
    (CustomTokenObtainPairSerializer) en vez del predeterminado.
    """
    serializer_class = CustomTokenObtainPairSerializer
