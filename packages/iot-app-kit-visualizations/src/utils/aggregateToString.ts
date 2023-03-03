/* Convert aggregate type to lowercase string */
export function aggregateToString(aggregate: string): string {
  return aggregate.replace(/_/g, ' ').toLowerCase();
}
