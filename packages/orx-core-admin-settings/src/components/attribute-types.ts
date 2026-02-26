/**
 * Attribute entity from API
 */
export interface AttributeEntity {
  id?: string;
  attribute: string;
  entity: string;
  createdBy: string;
  modifiedBy: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * Attribute value from API
 */
export interface AttributeValue {
  attribute: string;
  attributeValue: string;
  description: string;
  createdBy: string;
  modifiedBy: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * Main attribute data type - matches API response exactly
 */
export interface AttributeData {
  attribute: string;
  description: string;
  dataType: string;
  systemDefinedLookup: 'Y' | 'N';
  predefinedSw: 'Y' | 'N';
  required: 'Y' | 'N';
  unitOfMeasure: string | null;
  predefinedFieldType: string | null;
  predefinedField: string | null;
  notes: string | null;
  attributeEntity: AttributeEntity[];
  attributeValues: AttributeValue[];
  createdBy: string;
  modifiedBy: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * Helper utilities for working with attribute data
 */
export const AttributeHelpers = {
  /** Convert "Y"/"N" to boolean */
  toBoolean: (value: string | undefined | null): boolean => value === 'Y',

  /** Convert boolean to "Y"/"N" */
  fromBoolean: (value: boolean): 'Y' | 'N' => (value ? 'Y' : 'N'),

  /** Get flat list of entity names */
  getEntities: (attributeEntity: AttributeEntity[] | null): string[] =>
    attributeEntity ? attributeEntity.map((e) => e.entity) : [],

  /** Get entity names as comma-separated string */
  getEntitiesDisplay: (attributeEntity: AttributeEntity[] | null): string =>
    attributeEntity ? attributeEntity.map((e) => e.entity).join(', ') : '',

  /** Get attribute values in simplified format */
  getValues: (attributeValues: AttributeValue[] | null) =>
    attributeValues
      ? attributeValues.map((v) => ({
          value: v.attributeValue,
          description: v.description
        }))
      : [],

  /** Create entity object from entity name */
  createEntity: (attribute: string, entity: string, createdBy = 'System'): AttributeEntity => ({
    attribute,
    entity,
    createdBy,
    modifiedBy: createdBy
  }),

  /** Create attribute value object */
  createValue: (attribute: string, value: string, description: string, createdBy = 'System'): AttributeValue => ({
    attribute,
    attributeValue: value,
    description,
    createdBy,
    modifiedBy: createdBy
  })
};
