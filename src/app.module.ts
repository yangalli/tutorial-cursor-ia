import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escola } from './entities/escola.entity';
import { Usuario } from './entities/usuario.entity';
import { EscolaUsuario } from './entities/escola-usuario.entity';
import { CategoriaPatrimonio } from './entities/categoria-patrimonio.entity';
import { CategoriaInventario } from './entities/categoria-inventario.entity';
import { Patrimonio } from './entities/patrimonio.entity';
import { DocumentoPatrimonio } from './entities/documento-patrimonio.entity';
import { Inventario } from './entities/inventario.entity';
import { DocumentoInventario } from './entities/documento-inventario.entity';

// Controllers
import { EscolaController } from './controllers/escola.controller';

// Services
import { EscolaService } from './services/escola.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'patrimonio'),
        entities: [
          Escola,
          Usuario,
          EscolaUsuario,
          CategoriaPatrimonio,
          CategoriaInventario,
          Patrimonio,
          DocumentoPatrimonio,
          Inventario,
          DocumentoInventario,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Escola,
      Usuario,
      EscolaUsuario,
      CategoriaPatrimonio,
      CategoriaInventario,
      Patrimonio,
      DocumentoPatrimonio,
      Inventario,
      DocumentoInventario,
    ]),
  ],
  controllers: [EscolaController],
  providers: [EscolaService],
})
export class AppModule { }
