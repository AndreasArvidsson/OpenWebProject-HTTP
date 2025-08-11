import esbuild from "esbuild";

(async () => {
    const ctx = await esbuild.context({
        entryPoints: ["test/liveTests.ts"],
        bundle: true,
        outfile: "test/www/index.js",
    });

    const { port } = await ctx.serve({ servedir: "test/www" });
    console.log(`Serving on http://localhost:${port}`);
})();
