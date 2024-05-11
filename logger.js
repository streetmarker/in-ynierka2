import { createLogger, format } from 'winston'
import { combine, timestamp, printf } from 'winston'
import { File } from 'winston/lib/winston/transports'

// const myFormat = printf(({ level, message, label, timestamp }) => {
//   return `${timestamp} [${label}] ${level}: ${message}`
// })

const logger = createLogger({
  level: 'info', // Poziom logowania
  // format: combine(
  //   timestamp(),
  //   myFormat
  // ),
  // transports: [
  //   new File({ filename: 'tutor-app-out.log' }), // Zapis do pliku .log
  //   new winston.transports.Console() // Zapis do konsoli
  // ]
})

export default logger
