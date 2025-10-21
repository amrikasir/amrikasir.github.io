import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { data } from 'autoprefixer';

export default function (eleventyConfig) {
  //compile tailwind before eleventy processes the files
  eleventyConfig.addPassthroughCopy({"resources/img": "assets/img"});

  eleventyConfig.on('eleventy.before', async () => {
	const tailwindInputPath = path.resolve('./resources/css/main.css');

	const tailwindOutputPath = './docs/assets/index.css';

	const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

	const outputDir = path.dirname(tailwindOutputPath);
	if (!fs.existsSync(outputDir)) {
	  fs.mkdirSync(outputDir, { recursive: true });
	}

	const result = await processor.process(cssContent, {
	  from: tailwindInputPath,
	  to: tailwindOutputPath,
	});

	fs.writeFileSync(tailwindOutputPath, result.css);
  });

  const processor = postcss([
	//compile tailwind
	tailwindcss(),

	//minify tailwind css
	cssnano({
	  preset: 'default',
	}),
  ]);

  console.log("Eleventy is building the site with Tailwind CSS...");
  return {
	dir: {
	  	input: "resources/view", 		// folder sumber halaman
		data: "../_data",			// folder data
		includes: "../_includes",		// folder include
		output: "docs"				// halaman lain masuk pages/
	},
	passthroughFileCopy: true
  };
}
