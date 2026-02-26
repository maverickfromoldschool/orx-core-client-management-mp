import {useState, useCallback} from 'react';

import {useGetAttribute, AttributeValue} from '../../../hooks/use-get-attribute';
import {ProductAttribute} from '../types';

interface UseAttributeValuesReturn {
  attributeValuesMap: Record<string, AttributeValue[]>;
  loadAttributeValues: (attributeCode: string) => Promise<void>;
  loadInitialAttributeValues: (attributes: ProductAttribute[]) => Promise<void>;
}

/**
 * Custom hook to manage attribute values loading and caching
 */
export const useAttributeValues = (): UseAttributeValuesReturn => {
  const {fetchAttribute} = useGetAttribute();
  const [attributeValuesMap, setAttributeValuesMap] = useState<Record<string, AttributeValue[]>>({});

  const loadAttributeValues = useCallback(
    async (attributeCode: string) => {
      if (!attributeCode || attributeValuesMap[attributeCode]) {
        return;
      }

      const attributeData = await fetchAttribute(attributeCode);
      if (attributeData?.attributeValues) {
        setAttributeValuesMap((prev) => ({
          ...prev,
          [attributeCode]: attributeData.attributeValues
        }));
      }
    },
    [fetchAttribute, attributeValuesMap]
  );

  const loadInitialAttributeValues = useCallback(
    async (attributes: ProductAttribute[]) => {
      if (attributes.length === 0) return;

      const uniqueAttributes = Array.from(new Set(attributes.map((attr) => attr.attribute)));
      const valuesMap: Record<string, AttributeValue[]> = {};

      await Promise.all(
        uniqueAttributes.map(async (attributeCode) => {
          const attributeData = await fetchAttribute(attributeCode);
          if (attributeData?.attributeValues) {
            valuesMap[attributeCode] = attributeData.attributeValues;
          }
        })
      );

      setAttributeValuesMap(valuesMap);
    },
    [fetchAttribute]
  );

  return {
    attributeValuesMap,
    loadAttributeValues,
    loadInitialAttributeValues
  };
};
