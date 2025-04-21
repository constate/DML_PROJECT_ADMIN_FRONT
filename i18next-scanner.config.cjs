const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const COMMON_EXTENSIONS = '/**/*.{js,jsx,ts,tsx,vue,html}';

module.exports = {
    input: [
        `./src/pages${COMMON_EXTENSIONS}`,
        `./src/components${COMMON_EXTENSIONS}`,
    ],
    ignore: [
        '**/*.stories.*', // 스토리북 파일 제외
    ],
    options: {
        defaultLng: 'ko-KR',
        lngs: ['ko-KR', 'en-US', 'ja-JP'],
        func: {
            list: ['i18next.t', 'i18n.t', '$i18n.t', 't'],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html'],
        },
        resource: {
            loadPath: path.join(
                __dirname,
                'src/utils/locales/{{lng}}/{{ns}}.json',
            ),
            savePath: path.join(
                __dirname,
                'src/utils/locales/{{lng}}/{{ns}}.json',
            ),
        },
        defaultValue(lng, ns, key) {
            const keyAsDefaultValue = ['ko-KR'];
            if (keyAsDefaultValue.includes(lng)) {
                const separator = '~~';
                const value = key.includes(separator)
                    ? key.split(separator)[1]
                    : key;
                return value;
            }
            return '';
        },
        keySeparator: false,
        nsSeparator: false,
        prefix: '%{',
        suffix: '}',
    },

    transform(file, enc, done) {
        const content = file.contents.toString('utf8');
        const i18nParser = this.parser;

        try {
            const ast = parser.parse(content, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx'], // TS + JSX 모두 지원
            });

            traverse(ast, {
                ObjectProperty(path) {
                    const keyNode = path.node.key;
                    const valueNode = path.node.value;

                    if (
                        keyNode.type === 'Identifier' &&
                        keyNode.name === 'label' &&
                        valueNode.type === 'StringLiteral'
                    ) {
                        const key = valueNode.value;
                        i18nParser.set(key, key); // "행복": "행복" 형태로 저장
                    }
                },
            });
        } catch (err) {
            console.error('🚨 Babel 파서 오류:', file.path);
            console.error(err.message);
        }

        done();
    },
};
