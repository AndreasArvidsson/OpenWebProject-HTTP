import esbuild from "esbuild";

(async () => {
    const ctx = await esbuild.context({
        entryPoints: ["test/testXhr.ts"],
        bundle: true,
        outdir: "test/www"
    });

    const { host, port } = await ctx.serve({ servedir: "test/www" });
    console.log(host, port);
})();
