import { Lote } from './Lote';
import { Palestrante } from './Palestrante';
import { RedeSocial } from './RedeSocial';

export interface Evento {
    id: number;
    local: string;
    dataEvento: Date;
    tema: string;
    qtdPessoas: number;
    lote: string;
    telefone: string;
    email: string;
    imagemURL: string;
    lotes: Lote[];
    redeSociais: RedeSocial[];
    palestranteEventos: Palestrante[];
}
