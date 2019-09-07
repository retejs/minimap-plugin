import vue from 'rollup-plugin-vue';

export default {
    input: 'src/index.js',
    name: 'MinimapPlugin',
    globals: {
        'vue': 'Vue'
    },
    plugins: [
        vue()
    ]
}