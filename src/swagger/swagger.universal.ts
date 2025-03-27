/**
 * Shared swagger types used in API documentation
 */
export enum SwaggerTypes {
  String = "string",
  Number = "number",
  Object = "object",
  Array = "array",
  Boolean = "boolean"
}

/**
 * Used swagger tags
 */
export enum SwaggerTags {
  General = "General",
  GraphNodes = "Nodes (Entities)",
  GraphEdges = "Edges (Relations)",
  Optimalization = "Optimalization"
}



/**
 * Define swagger property object from input parameters
 * @param name Name of the property
 * @param type Swagger type of the property
 * @param description Optional - description of the property
 * @returns 
 */
export const defineSwaggerProperty = (name: string, type: SwaggerTypes | string, description = "", nullable = false) => {
  return {
    [name]: {
      type: type as any,
      description: description as any,
      nullable
    }
  }
}

/**
 * Define swagger array items from scalar values
 * @param name Name of swagger property
 * @param itemPropertyType What swagger type is the property
 * @param description Optional - something to say about?
 * @returns OpenAPI property declaration
 */
export const defineSwaggerPropertyFromScalarArray = (name: string, itemPropertyType: SwaggerTypes, description = "") => {
  return {
    [name]: {
      type: SwaggerTypes.Array,
      description,
      items: {
        type: itemPropertyType,
      }
    }
  }
}

/**
 * Define swagger array items from object values
 * @param name Name of swagger property
 * @param itemProperties Property declarations
 * @param description Optional - something to say about?
 * @returns OpenAPI property declaration
 */
export const defineSwaggerPropertyFromObjectArray = (name: string, itemProperties: object, description = "") => {
  return {
    [name]: {
      type: SwaggerTypes.Array,
      description,
      items: {
        type: SwaggerTypes.Object,
        properties: {
          ...itemProperties
        }
      }
    }
  }
}

/**
 * Retype existing javascript property into swagger type
 * @param jsProperty JavaScript property (with value)
 * @returns Swagger type for the schema
 */
export const javascriptToSwaggerType = (jsProperty: any) => {
  if (Array.isArray(jsProperty))
    return SwaggerTypes.Array

  switch (typeof jsProperty) {
    case "bigint":
      return SwaggerTypes.Number
    case "number":
      return SwaggerTypes.Number
    case "boolean":
      return SwaggerTypes.Boolean
    case "object":
      return SwaggerTypes.Object
    case "string":
      return SwaggerTypes.String
    default:
      return SwaggerTypes.Object
  }
}

/**
 * Create swagger properties object content from sample of real data (javascript object with values)
 * @param existingSample An object with sample values
 * @returns Content into "properties" swagger object 
 */
export const swaggerPropertiesFromObjectSample = (existingSample: any): any => {
  let results = {}
  for (const key in existingSample) {
    const sampleValue: any = existingSample[key]
    const sampleSwaggerType = javascriptToSwaggerType(sampleValue)

    // sample is an object
    if (sampleSwaggerType === SwaggerTypes.Object) {
      const objectKeys = Object.keys(sampleValue)

      // the object has properties
      if (objectKeys.length > 0)
        results = { ...results, [key]: { type: SwaggerTypes.Object, properties: { ...swaggerPropertiesFromObjectSample(sampleValue) } } }

      //...or just any object - client can fill with anything
      else
        results = { ...results, [key]: { type: SwaggerTypes.Object, additionalProperties: true } }
    }

    // sample is array of scalars or objects
    else if (sampleSwaggerType === SwaggerTypes.Array) {
      const sampleArray: any[] = [...sampleValue]

      // no sample value to analyze - return just an object type
      if (sampleArray.length < 1) {
        results = {
          ...results, [key]: {
            type: SwaggerTypes.Array,
            items: {
              type: SwaggerTypes.Object
            }
          }
        }
      }

      // sample has a value
      else {
        const sampleItem = sampleArray[0]
        const convertedSampleType = javascriptToSwaggerType(sampleItem)

        // sample item value is an object
        if (convertedSampleType === SwaggerTypes.Object) {
          results = {
            ...results, [key]: {
              type: SwaggerTypes.Array,
              items: {
                type: SwaggerTypes.Object,
                properties: {
                  ...swaggerPropertiesFromObjectSample(sampleItem)
                }
              }
            }
          }
        }
        // sample item value is a scalar
        else {
          results = {
            ...results, [key]: {
              type: SwaggerTypes.Array,
              items: {
                type: convertedSampleType
              }
            }
          }
        }
      }
    }

    // sample is scalar value
    else
      results = { ...results, [key]: { type: sampleSwaggerType } }
  }

  return results
}

/**
 * Shared swagger key url parameter for database read
 * @returns 
 */
export const findByKeySetup = () => ({
  type: "object",
  required: ["key"],
  properties: {
    ...defineSwaggerProperty("key", SwaggerTypes.String, "Key to existing database entity")
  }
})

/**
 * Parameters for basic entity filtering inclued in other entities
 */
export const basicEntityFilterParameters = ({
  ...defineSwaggerProperty("key", SwaggerTypes.String, "Key to existing database entity"),
  ...defineSwaggerProperty("nameInternal", SwaggerTypes.String, "Internal property name"),
  ...defineSwaggerProperty("nameDisplay", SwaggerTypes.String, "Visible property name"),
 })

