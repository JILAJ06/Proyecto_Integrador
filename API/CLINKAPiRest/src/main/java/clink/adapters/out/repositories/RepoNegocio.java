package clink.adapters.out.repositories;

import clink.adapters.out.DataBaseConfig;
import clink.domain.entities.Negocio;
import clink.domain.entities.Producto;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RepoNegocio {
    public void create(Negocio negocio) throws SQLException {
        String sql = "INSERT INTO negocio(Nombre_Negocio) VALUES (?)";
        try(Connection conn = DataBaseConfig.getDataSource().getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql);) {
            stmt.setString(1, negocio.getNombreNegocio());
            stmt.executeUpdate();
        }
        DataBaseConfig.closePool();
    }

    public Negocio getByID(int idNegocio) throws SQLException {
        Negocio negocio = new Negocio();
        String sql = "SELECT * FROM negocio WHERE ID_Negocio = ?";

        try(Connection conn = DataBaseConfig.getDataSource().getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql);) {

            stmt.setInt(1, idNegocio);

            try(ResultSet rs = stmt.executeQuery()){
                if(rs.next()) {
                    negocio.setIdNegocio(idNegocio);
                    negocio.setNombreNegocio(rs.getString("Nombre_Negocio"));
                }
            }
        }
        return negocio;
    }

    /*public void remove(int idNegocio) throws SQLException {
        String sql = "DELETE FROM negocio WHERE ID_Negocio = ?";
        try(Connection conn = DataBaseConfig.getDataSource().getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql);) {
            stmt.setInt(1, idNegocio);
            stmt.executeUpdate();
        }
    }*/
}
