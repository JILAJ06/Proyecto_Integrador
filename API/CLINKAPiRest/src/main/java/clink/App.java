package clink;

import clink.adapters.in.appmodules.DomainLayer;
import clink.adapters.in.appmodules.LayerOne;
import io.javalin.Javalin;
import io.javalin.plugin.bundled.CorsPluginConfig;

public class App {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(CorsPluginConfig.CorsRule::anyHost);
            });
        }).start(7000);

        LayerOne.initNegocio();
        LayerOne.initUsuario();
    }
}