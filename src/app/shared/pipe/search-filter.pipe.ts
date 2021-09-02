import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(list: any[], filterText: string, propertyName?: string): any {
    if(propertyName) {
      let properties: any = propertyName.split(',');
      return list.filter(item => item[properties[0]].search(new RegExp(filterText, 'i')) > -1 || item[properties[1]].search(new RegExp(filterText, 'i')) > -1) 
    }
    return list.filter(item => item.search(new RegExp(filterText, 'i')) > -1);
  }

}
