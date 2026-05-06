#!/usr/bin/env node
/**
 * Command entrypoint for generating Google Stitch UI mockup options.
 *
 * The implementation lives in small modules under `scripts/stitch-mockups/`
 * so each hand-written file stays easy for contributors and agents to review.
 */

import path from "node:path";
import { pathToFileURL } from "node:url";
import { runCli, usage } from "./stitch-mockups/workflow.mjs";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli(process.argv.slice(2))
    .then((result) => {
      if (result.help) {
        console.log(result.message);
        return;
      }

      console.log(`Generated ${result.generatedOptions.length} Stitch mockup option(s).`);
      console.log(`Review Markdown: ${path.relative(process.cwd(), result.paths.indexPath)}`);
      console.log(`Preview HTML: ${pathToFileURL(result.paths.htmlIndexPath).href}`);
    })
    .catch((error) => {
      console.error(error.message);
      console.error("");
      console.error(usage());
      process.exitCode = 1;
    });
}
