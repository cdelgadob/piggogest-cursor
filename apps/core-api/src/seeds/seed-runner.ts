import { DataSource } from 'typeorm';
import { TransferenciaV1Seed } from './transferencia-v1.seed';
import { ExpedientesSeed } from './expedientes.seed';
import { Cliente } from '../entities';

export class SeedRunner {
  constructor(private dataSource: DataSource) {}

  async runAllSeeds(): Promise<void> {
    console.log('Starting database seeding...');

    try {
      // Run transferencia v1 seed
      const transferenciaSeed = new TransferenciaV1Seed(this.dataSource);
      await transferenciaSeed.run();

      // Create sample clients
      await this.createSampleClients();

      // Run expedientes seed
      const expedientesSeed = new ExpedientesSeed(this.dataSource);
      await expedientesSeed.run();

      console.log('All seeds completed successfully!');
    } catch (error) {
      console.error('Error running seeds:', error);
      throw error;
    }
  }

  private async createSampleClients(): Promise<void> {
    const clienteRepository = this.dataSource.getRepository(Cliente);

    // Check if clients already exist
    const existingClients = await clienteRepository.count();
    if (existingClients > 0) {
      console.log('Sample clients already exist, skipping...');
      return;
    }

    const sampleClients = [
      {
        nombre: 'Juan Carlos',
        apellido: 'Pérez García',
        email: 'juan.perez@email.com',
        telefono: '+57 300 123 4567',
        documento: '12345678',
        tipoDocumento: 'CC',
        direccion: 'Calle 123 #45-67',
        ciudad: 'Bogotá',
        pais: 'Colombia',
        codigoPostal: '110111',
        activo: true
      },
      {
        nombre: 'María Elena',
        apellido: 'Rodríguez López',
        email: 'maria.rodriguez@email.com',
        telefono: '+57 301 234 5678',
        documento: '87654321',
        tipoDocumento: 'CC',
        direccion: 'Carrera 45 #78-90',
        ciudad: 'Medellín',
        pais: 'Colombia',
        codigoPostal: '050001',
        activo: true
      },
      {
        nombre: 'Carlos Alberto',
        apellido: 'González Martínez',
        email: 'carlos.gonzalez@email.com',
        telefono: '+57 302 345 6789',
        documento: '11223344',
        tipoDocumento: 'CC',
        direccion: 'Avenida 80 #12-34',
        ciudad: 'Cali',
        pais: 'Colombia',
        codigoPostal: '760001',
        activo: true
      }
    ];

    for (const clientData of sampleClients) {
      const cliente = clienteRepository.create(clientData);
      await clienteRepository.save(cliente);
    }

    console.log('Sample clients created successfully!');
  }
}