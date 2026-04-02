export default {
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            all: true,
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: [
                'node_modules/',
                'dist/',
                'server.ts',
                'services/'
            ]
        }
    }
}