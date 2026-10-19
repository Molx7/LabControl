package com.labcontrol.repository;

import com.labcontrol.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {

    Optional<Equipamento> findByNumeroPatrimonio(String numeroPatrimonio);

    boolean existsByNumeroPatrimonio(String numeroPatrimonio);
}
