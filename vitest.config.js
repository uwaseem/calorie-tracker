export default {
    test: {
        globals: true,
        environment: 'node',
        exclude: ['tests/ui'],
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