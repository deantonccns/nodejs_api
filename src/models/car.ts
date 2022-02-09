import { model, Model, Schema } from 'mongoose'
import Ajv, {JSONSchemaType} from 'ajv'

export interface ICar{
    id: string;
    brand: string;
    color: string;
    model: string;
    capacity: number;
}

const CarSchema: Schema<ICar> = new Schema<ICar>({
    id: { type: String, required: true },
    brand: { type: String,},
    color: { type: String,},
    model: { type: String,},
    capacity: { type: Number}
});

const CarAjvSchema: JSONSchemaType<ICar> = {
    type: "object",
    properties: {
        id: { type: "string"},
        brand: { type: "string"},
        color: { type: "string"},
        model: { type: "string"},
        capacity: { type: "integer"}
    },
    required: ['id'],
    additionalProperties: false
}

const carModel: Model<ICar> = model<ICar>('car', CarSchema);
const carModelValidator = new Ajv().compile(CarAjvSchema)

export {carModel, carModelValidator};
