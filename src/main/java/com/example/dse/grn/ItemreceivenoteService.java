
package com.example.dse.grn;

import java.sql.Date;

public interface ItemreceivenoteService {
    Itemreceivenote createItemreceivenote(Itemreceivenote itemreceivenote);
    org.springframework.data.domain.Page<Itemreceivenote> getItemreceivenotesFiltered(Integer supplierId, Date date, org.springframework.data.domain.Pageable pageable);
    Itemreceivenote getItemreceivenoteById(Integer id);
}
