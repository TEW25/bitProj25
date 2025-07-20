
package com.example.demo.inventory;

import java.sql.Date;
import java.util.List;

public interface ItemreceivenoteService {
    Itemreceivenote createItemreceivenote(Itemreceivenote itemreceivenote);
    List<Itemreceivenote> getItemreceivenotesFiltered(Integer supplierId, Date date);
    Itemreceivenote getItemreceivenoteById(Integer id);
}
