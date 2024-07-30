import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'


const serverurl = "http://127.0.0.1:8099/";

export default defineConfig({
	plugins: [vue({
		template: {
			compilerOptions: {
				hoistStatic: false
			}
		}
	})],
	resolve: {
		alias: {
			'@': '/src',
			'@components': '/src/components',
		}
	},
	build: {
		cssCodeSplit: true,
		//构建后是否生成 source map 文件
		sourcemap: false,
		manifest: false,
		// 设置为 false 可以禁用最小化混淆，
		// 或是用来指定使用哪种混淆器
		// boolean | 'terser' | 'esbuild'
		minify: 'terser', //terser 构建后文件体积更小
		//传递给 Terser 的更多 minify 选项。
		terserOptions: {
			//生产环境不要日志，去掉console,debugger
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		//设置为 false 来禁用将构建后的文件写入磁盘
		write: true,
		//默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
		emptyOutDir: true,
		//启用/禁用 brotli 压缩大小报告
		// brotliSize: true,
		//chunk 大小警告的限制
		chunkSizeWarningLimit: 500,

		rollupOptions: {
			output: {
				entryFileNames: `js/[name].[hash].js`,
				chunkFileNames: `js/[name].[hash].js`
			}
		}
	},
	server: {
		port: 8084,
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: serverurl,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/admin/api': serverurl,
			'/erp/api': serverurl,
			'/amazon/api': serverurl,
			'/amazonadv/api': serverurl
		}
	}
})