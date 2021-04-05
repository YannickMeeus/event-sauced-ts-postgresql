class ConcurrencyError extends Error {
  constructor(
    public readonly streamId: string,
    public readonly eventId: string,
    public readonly faultyVersion: string
  ) {
    // 'Error' breaks prototype chain here
    super(
      `Concurrency conflict when appending event(s) [${eventId}] to stream [${streamId}] and version [${faultyVersion}].`
    )

    // restore prototype chain
    const actualProto = new.target.prototype

    Object.setPrototypeOf(this, actualProto)
  }
}

export { ConcurrencyError }
