export function buildRelation(
  relationName: string,
  idField: string,
  id: number | null
) {
  if (id == null) {
    return {};
  }

  return {
    [relationName]: {
      connect: { [idField]: id },
    },
  };
}
