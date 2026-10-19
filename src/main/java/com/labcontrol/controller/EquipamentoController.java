package com.labcontrol.controller;

import com.labcontrol.model.Equipamento;
import com.labcontrol.service.EquipamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/equipamentos")
@CrossOrigin(origins = "*")
public class EquipamentoController {

    private final EquipamentoService equipamentoService;

    public EquipamentoController(EquipamentoService equipamentoService) {
        this.equipamentoService = equipamentoService;
    }

    @PostMapping
    public ResponseEntity<Equipamento> criar(@Valid @RequestBody Equipamento equipamento) {
        Equipamento criado = equipamentoService.criar(equipamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<Equipamento>> listar() {
        List<Equipamento> lista = equipamentoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarPorId(@PathVariable Long id) {
        Equipamento equipamento = equipamentoService.buscarPorId(id);
        return ResponseEntity.ok(equipamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipamento> atualizar(@PathVariable Long id, @Valid @RequestBody Equipamento equipamento) {
        Equipamento atualizado = equipamentoService.atualizar(id, equipamento);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        equipamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
