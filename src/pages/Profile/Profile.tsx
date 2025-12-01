import React, { useState, useEffect } from "react";
import BackButton from "../../components/common/Button/BackButton";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { userService, type User } from "../../services/api/userService";

// Interfaz para los datos del perfil formateados
interface DatosPerfil {
  nombre: string;
  correo: string;
  edad: number;
  peso: string;
  estatura: string;
  nivelActividad: string;
  meta: string;
  urlAvatar?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<DatosPerfil | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para formatear los datos del usuario
  const formatUserData = (user: User): DatosPerfil => {
    // Mapear fitness_goal a texto legible
    const goalMap: Record<string, string> = {
      'perder_peso': 'Perder peso',
      'mantener_peso': 'Mantener peso',
      'ganar_peso': 'Ganar peso',
      'ganar_musculo': 'Ganar masa muscular',
    };

    // Mapear activity_level a texto legible
    const activityMap: Record<string, string> = {
      'bajo': 'Bajo',
      'moderado': 'Medio',
      'alto': 'Alto',
    };

    return {
      nombre: user.name,
      correo: user.email,
      edad: user.age,
      peso: `${user.weight} kg`,
      estatura: `${user.height} cm`,
      nivelActividad: activityMap[user.activity_level] || user.activity_level,
      meta: goalMap[user.fitness_goal] || user.fitness_goal,
    };
  };

  useEffect(() => {
    const loadUserProfile = () => {
      console.log('🔍 Iniciando carga de perfil...');
      
      // Verificar si hay token antes de continuar
      const isAuth = userService.isAuthenticated();
      console.log('🔐 Usuario autenticado:', isAuth);
      
      if (!isAuth) {
        console.log('❌ Usuario no autenticado, redirigiendo a login');
        navigate('/login');
        return;
      }

      // Obtener usuario del localStorage
      const localUser = userService.getCurrentUser();
      console.log('👤 Usuario local:', localUser);
      
      if (localUser) {
        try {
          const formattedData = formatUserData(localUser);
          console.log('✅ Datos formateados:', formattedData);
          setProfileData(formattedData);
          setIsLoading(false);
        } catch (error) {
          console.error('❌ Error al formatear datos:', error);
          setIsLoading(false);
          alert('Error al cargar el perfil');
          navigate('/login');
        }
      } else {
        console.log('❌ No hay usuario en localStorage');
        setIsLoading(false);
        alert('No se encontró información del usuario. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      }
    };

    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Mostrar loader mientras carga
  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header con botón de regreso */}
      <div className="flex items-center justify-start p-5">
        <BackButton onClick={handleBack} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center px-6 pb-24">
        {/* Avatar */}
        <div className="mb-6">
          {profileData.urlAvatar ? (
            <img
              src={profileData.urlAvatar || "/placeholder.svg"}
              alt={`Foto de perfil de ${profileData.nombre}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
            />
          ) : (
            <div className="w-46 h-46 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold border-4 border-gray-600">
              {getInitials(profileData.nombre)}
            </div>
          )}
        </div>

        {/* Nombre */}
        <h1 className="text-2xl font-bold mb-8 text-center">
          {profileData.nombre}
        </h1>

        {/* Información del perfil en un solo bloque */}
        <div className="w-full md:max-w-4xl bg-[#262626] rounded-lg p-5 space-y-8">
          {/* Correo */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Correo:</span>
            <span className="text-white">{profileData.correo}</span>
          </div>

          {/* Edad */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Edad:</span>
            <span className="text-white">{profileData.edad}</span>
          </div>

          {/* Peso */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Peso:</span>
            <span className="text-white">{profileData.peso}</span>
          </div>

          {/* Estatura */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Estatura:</span>
            <span className="text-white">{profileData.estatura}</span>
          </div>

          {/* Nivel de actividad */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">
              Nivel de actividad:
            </span>
            <span className="text-white">{profileData.nivelActividad}</span>
          </div>

          {/* Meta */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Meta:</span>
            <span className="text-white">{profileData.meta}</span>
          </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
