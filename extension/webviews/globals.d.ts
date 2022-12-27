declare global {
    const tsvscode: {
        postMessage: ({ command: string, value: any}) => void
    }
}