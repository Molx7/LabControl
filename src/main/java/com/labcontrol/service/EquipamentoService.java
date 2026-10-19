package com.labcontrol.service;

import com.labcontrol.exception.DuplicateResourceException;
import com.labcontrol.exception.ResourceNotFoundException;
import com.labcontrol.model.Equipamento;
import com.labcontrol.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EquipamentoService {

    private final EquipamentoRepository equipamentoRepository;

    public EquipamentoService(EquipamentoRepository equipamentoRepository) {
        this.equipamentoRepository = equipamentoRepository;
    }

    @Transactional
    public Equipamento criar(Equipamento equipamento) {
        equipamento.setId(null);
        if (equipamentoRepository.existsByNumeroPatrimonio(equipamento.getNumeroPatrimonio())) {
            throw new DuplicateResourceException("Número de patrimônio já cadastrado: " + equipamento.getNumeroPatrimonio());
        }
        return equipamentoRepository.save(equipamento);
    }

    @Transactional(readOnly = true)
    public List<Equipamento> listarTodos() {
        return equipamentoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Equipamento buscarPorId(Long id) {
        return equipamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipamento não encontrado com o ID: " + id));
    }

    @Transactional
    public Equipamento atualizar(Long id, Equipamento dadosAtualizacao) {
        Equipamento existente = equipamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipamento não encontrado com o ID: " + id));

        Optional<Equipamento> comMesmoPatrimonio = equipamentoRepository.findByNumeroPatrimonio(dadosAtualizacao.getNumeroPatrimonio());
        if (comMesmoPatrimonio.isPresent() && !comMesmoPatrimonio.get().getId().equals(id)) {
            throw new DuplicateResourceException("Número de patrimônio já cadastrado: " + dadosAtualizacao.getNumeroPatrimonio());
        }

        existente.setNome(dadosAtualizacao.getNome());
        existente.setNumeroPatrimonio(dadosAtualizacao.getNumeroPatrimonio());
        existente.setCategoria(dadosAtualizacao.getCategoria());
        existente.setQuantidade(dadosAtualizacao.getQuantidade());

        return equipamentoRepository.save(existente);
    }

    @Transactional
    public void excluir(Long id) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipamento não encontrado com o ID: " + id));
        equipamentoRepository.delete(equipamento);
    }
}
