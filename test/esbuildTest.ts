import esbuild from "esbuild";

(async () => {
    const ctx = await esbuild.context({
        entryPoints: ["test/testXhr.ts", "test/testHttp.ts"],
        bundle: true,
        outdir: "test/www",
    });

    const { port } = await ctx.serve({ servedir: "test/www" });
    console.log(`Serving on http://localhost:${port}`);
})();
