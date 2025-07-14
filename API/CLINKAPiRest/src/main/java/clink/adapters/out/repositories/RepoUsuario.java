package clink.adapters.out.repositories;

import clink.adapters.out.DataBaseConfig;
import clink.domain.entities.Negocio;
import clink.domain.entities.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RepoUsuario {
    public void create(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuario (Nombre_Usuario, ID_Negocio, crea_Nombre_Usuario, Correo, Rol, Contrasena," +
                "Calle, Colonia, Codigo_Postal) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DataBaseConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, usuario.getNombreUsuario());
            stmt.setInt(2, usuario.getNegocio().getIdNegocio());
            stmt.setString(3, usuario.getCreador().getNombreUsuario());
            stmt.setString(4, usuario.getCorreo());
            stmt.setString(5, usuario.getRol());
            stmt.setString(6, usuario.getContrasena());
            stmt.setString(7, usuario.getCalle());
            stmt.setString(8, usuario.getColonia());
            stmt.setString(9, usuario.getCodigoPostal());
            stmt.executeUpdate();
        }
    }

    public Negocio getAllUsuariosInNegocio(int idNegocio) throws SQLException {
        Negocio negocio = null;
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT u.Nombre_Usuario AS nombreUsuario, " +
                "u.Correo AS correo, " +
                "u.Rol AS rol, " +
                "u.Contrasena AS contrasena, " +
                "u.Calle AS calle, " +
                "u.Colonia AS colonia, " +
                "u.Codigo_Postal AS codigoPostal, " +
                "n.ID_Negocio AS idNegocio, " +
                "n.Nombre_Negocio AS nombreNegocio, " +
                "c.Nombre_Usuario AS creadorUsuario, " +
                "c.Rol AS creadorRol " +
                "FROM usuario u JOIN negocio n ON u.ID_Negocio = n.ID_Negocio LEFT JOIN usuario c ON " +
                "u.crea_Nombre_Usuario = c.Nombre_Usuario " +
                "WHERE n.ID_NEGOCIO = ?";

        try (Connection conn = DataBaseConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idNegocio);

            try (ResultSet rs = stmt.executeQuery()) {
                // Crear el objeto negocio una sola vez
                if (rs.next()) {
                    negocio = new Negocio(idNegocio, rs.getString("nombreNegocio"));

                    do {
                        //Creador
                        Usuario creador = null;
                        String creadorUsuario = rs.getString("creadorUsuario");
                        if (creadorUsuario != null) {
                            creador = new Usuario();
                            creador.setNombreUsuario(creadorUsuario);
                            creador.setRol(rs.getString("creadorRol"));
                        }

                        //Usuario
                        Usuario usuario = new Usuario();
                        usuario.setNombreUsuario(rs.getString("nombreUsuario"));
                        usuario.setNegocio(negocio); // Referencia al negocio
                        usuario.setCreador(creador);
                        usuario.setCorreo(rs.getString("correo"));
                        usuario.setRol(rs.getString("rol"));
                        usuario.setContrasena(rs.getString("contrasena"));
                        usuario.setCalle(rs.getString("calle"));
                        usuario.setColonia(rs.getString("colonia"));
                        usuario.setCodigoPostal(rs.getString("codigoPostal"));

                        negocio.addUsuarios(usuario); // Añadir el usuario al negocio
                    } while (rs.next());
                }
            }
        }
        return negocio;
    }

    public Usuario getUsuarioInNegocio(int idNegocio, String nombreUsuario) throws SQLException {
        Usuario usuario = null;
        Negocio negocio = null;
        String sql = "SELECT u.Nombre_Usuario AS nombreUsuario, " +
                "u.Correo AS correo, " +
                "u.Rol AS rol, " +
                "u.Contrasena AS contrasena, " +
                "u.Calle AS calle, " +
                "u.Colonia AS colonia, " +
                "u.Codigo_Postal AS codigoPostal, " +
                "n.ID_Negocio AS idNegocio, " +
                "n.Nombre_Negocio AS nombreNegocio, " +
                "c.Nombre_Usuario AS creadorUsuario, " +
                "c.Rol AS creadorRol " +
                "FROM usuario u JOIN negocio n ON u.ID_Negocio = n.ID_Negocio LEFT JOIN usuario c ON " +
                "u.crea_Nombre_Usuario = c.Nombre_Usuario " +
                "WHERE n.ID_NEGOCIO = ? AND u.Nombre_Usuario = ?";

        try (Connection conn = DataBaseConfig.getDataSource().getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setInt(1, idNegocio);
            stmt.setString(2, nombreUsuario);

            try(ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    negocio = new Negocio(idNegocio, rs.getString("nombreNegocio"));

                    // Creador
                    Usuario creador = null;
                    String creadorUsuario = rs.getString("creadorUsuario");
                    if(creadorUsuario != null){
                        creador = new Usuario();
                        creador.setNombreUsuario(creadorUsuario);
                        creador.setRol(rs.getString("creadorRol"));
                    }

                    // Usuario
                    usuario = new Usuario();
                    usuario.setNombreUsuario(nombreUsuario);
                    usuario.setNegocio(negocio); // Referencia al negocio
                    usuario.setCreador(creador);
                    usuario.setCorreo(rs.getString("correo"));
                    usuario.setRol(rs.getString("rol"));
                    usuario.setContrasena(rs.getString("contrasena"));
                    usuario.setCalle(rs.getString("calle"));
                    usuario.setColonia(rs.getString("colonia"));
                    usuario.setCodigoPostal(rs.getString("codigoPostal"));
                    negocio.addUsuarios(usuario); // Añadir el usuario al negocio
                }
            }

        }

        return usuario;
    }

    public void deleteUsuario(int idNegocio, String nombreUsuario) throws SQLException {
        String sql = "DELETE FROM usuario WHERE ID_Negocio = ? AND Nombre_Usuario = ?";
        try (Connection conn = DataBaseConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idNegocio);
            stmt.setString(2, nombreUsuario);
            stmt.executeUpdate();
        }
        DataBaseConfig.closePool();
    }



}

