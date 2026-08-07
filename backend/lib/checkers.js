export function serializeChecker(checker) {
  const value = checker.toObject ? checker.toObject() : checker;
  const currentWorkload = value.assignedElders?.length ?? 0;
  return {
    ...value,
    currentWorkload,
    availableCapacity: Math.max(value.maxWorkload - currentWorkload, 0)
  };
}
