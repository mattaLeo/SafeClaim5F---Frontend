export interface sinistro {
    automobilista_id: number; 
    targa: string;
    data_evento: Date;
    descrizione: string;
    stato?: string;
    data_creazione?: Date;
}