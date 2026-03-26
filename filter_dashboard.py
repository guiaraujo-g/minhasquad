import re
from bs4 import BeautifulSoup

allowed_names = {
    "Adriel Henrique Borges Cochito",
    "Antonio Balardino",
    "Bruna Elis Vogel",
    "Daniel Cruz",
    "Wellington Casas",
    "Pedro Bittencourt",
    "Jonas Elan",
    "Maria Eduarda da Silva Joaquim"
}

with open('squads/jira-productivity/output/2026-03-26-100000/v2/dashboard.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# Filter tables
tables = soup.find_all('table')
for table in tables:
    headers = [th.get_text().strip() for th in table.find_all('th')]
    if not headers:
        continue
    
    # Check if first column is a person identifier
    first_col = headers[0]
    if first_col not in ['Responsável', 'Criador']:
        continue
        
    tbody = table.find('tbody')
    if not tbody:
        continue
        
    rows = tbody.find_all('tr')
    new_rows = []
    
    # We need to recalculate totals
    # Let's store the sums for each numeric column
    col_sums = [0.0] * len(headers)
    has_total_row = False
    
    for row in rows:
        cells = row.find_all('td')
        if not cells:
            continue
            
        name = cells[0].get_text().strip()
        if name == 'Total':
            has_total_row = True
            continue
            
        if name in allowed_names:
            new_rows.append(row)
            # Add to sums
            for i in range(1, len(cells)):
                text_val = cells[i].get_text().strip().replace('%', '').replace('d', '').strip()
                try:
                    val = float(text_val)
                    col_sums[i] += val
                except ValueError:
                    pass
    
    # Clear tbody and append filtered rows
    tbody.clear()
    for row in new_rows:
        tbody.append(row)
        
    # Re-add total row if it existed
    if has_total_row:
        total_row = soup.new_tag('tr')
        td_name = soup.new_tag('td')
        td_name.string = 'Total'
        total_row.append(td_name)
        
        for i in range(1, len(headers)):
            td = soup.new_tag('td')
            td['class'] = 'num'
            
            # If it's a percentage column, we'll recalculate it later or just put '-'
            if 'Peso %' in headers[i] or headers[i] == 'Peso %':
                td.string = '—'
            elif headers[i] == '': # Bar cell
                td.string = ''
            else:
                # Format as int if it's an integer, else float
                val = col_sums[i]
                if val.is_integer():
                    td.string = str(int(val))
                else:
                    td.string = f"{val:.2f}"
            total_row.append(td)
            
        tbody.append(total_row)
        
    # Now recalculate percentages and bar widths if 'Peso %' exists
    if 'Peso %' in headers:
        peso_idx = headers.index('Peso %')
        # Find the column that we base the percentage on. Usually it's the column before 'Peso %'
        base_idx = peso_idx - 1
        total_base = col_sums[base_idx]
        
        for row in tbody.find_all('tr'):
            cells = row.find_all('td')
            name = cells[0].get_text().strip()
            if name == 'Total':
                continue
                
            try:
                val = float(cells[base_idx].get_text().strip())
                pct = (val / total_base * 100) if total_base > 0 else 0
                cells[peso_idx].string = f"{pct:.2f}"
                
                # Update bar if exists
                if len(cells) > peso_idx + 1:
                    bar_cell = cells[peso_idx + 1]
                    bar_fill = bar_cell.find('div', class_='bar-fill')
                    if bar_fill:
                        bar_fill['style'] = f"width:{pct:.2f}%"
            except ValueError:
                pass

# Update N3 Metric Card
# The N3 metric card had 160. We need to update it to the sum of N3 tickets for the 8 people in the period.
# Wait, the N3 tickets table in v2/dashboard.html is the "Tickets N3" table. Let's find its total.
n3_total = 0
for table in soup.find_all('table'):
    prev_h2 = table.find_previous('h2')
    if prev_h2 and 'Tickets N3' in prev_h2.get_text() and 'Histórico' not in prev_h2.get_text():
        # Find the total row
        for row in table.find_all('tr'):
            cells = row.find_all('td')
            if cells and cells[0].get_text().strip() == 'Total':
                n3_total = cells[1].get_text().strip()

# Find the metric card for N3
for card in soup.find_all('div', class_='metric-card'):
    label = card.find('div', class_='metric-label')
    if label and 'Tickets N3 Resolvidos' in label.get_text():
        val_div = card.find('div', class_='metric-value')
        if val_div:
            val_div.string = str(n3_total)

with open('squads/jira-productivity/output/2026-03-26-100000/v3/dashboard.html', 'w') as f:
    f.write(str(soup))
