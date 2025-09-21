import { gql } from 'apollo-angular';

export const GET_EXPEDIENTES = gql`
  query GetExpedientes {
    expedientes {
      id
      numeroExpediente
      estado
      descripcion
      fechaInicio
      fechaVencimiento
      fechaCompletado
      progreso
      responsable
      observaciones
      activo
      createdAt
      updatedAt
      cliente {
        id
        nombre
        apellido
        email
        telefono
        documento
        tipoDocumento
      }
      tramiteCatalogo {
        id
        nombre
        descripcion
      }
      eventos {
        id
        tipo
        nivel
        titulo
        descripcion
        usuario
        sistema
        esAutomatico
        requiereAtencion
        accionRequerida
        fechaVencimiento
        createdAt
      }
    }
  }
`;

export const GET_EXPEDIENTE_BY_ID = gql`
  query GetExpedienteById($id: String!) {
    expediente(id: $id) {
      id
      numeroExpediente
      estado
      descripcion
      datosAdicionales
      fechaInicio
      fechaVencimiento
      fechaCompletado
      progreso
      responsable
      observaciones
      activo
      createdAt
      updatedAt
      cliente {
        id
        nombre
        apellido
        email
        telefono
        documento
        tipoDocumento
        direccion
        ciudad
        pais
        codigoPostal
      }
      tramiteCatalogo {
        id
        nombre
        descripcion
        categoria
        tiempoEstimado
        requisitos
      }
      documentos {
        id
        nombre
        tipo
        url
        fechaSubida
        verificado
        observaciones
      }
      eventos {
        id
        tipo
        nivel
        titulo
        descripcion
        usuario
        sistema
        datosAdicionales
        esAutomatico
        requiereAtencion
        accionRequerida
        fechaVencimiento
        createdAt
      }
    }
  }
`;