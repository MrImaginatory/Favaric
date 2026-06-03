import { z } from 'zod'
import StatusMessages from '../configs/message.config.js';

const uuidValidation = z.object({
    params: z.object({
        id: z.string("ID is required")
            .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    })
})

export { uuidValidation }