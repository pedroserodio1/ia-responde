export interface SaveMessageDTO {
  id: string
  from: string
  text: string
  fromMe: boolean
  timestamp: number
  pushName: string | null
}
