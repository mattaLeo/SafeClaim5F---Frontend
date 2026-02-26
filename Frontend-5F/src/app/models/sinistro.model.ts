export interface sinistro{
    id_automobilista: number
    targa: string
    data: Date
    descrizione: string
    stato: "APERTO" | "CHIUSO" | "IN ANALISI" | string
    data_creazione: Date
}