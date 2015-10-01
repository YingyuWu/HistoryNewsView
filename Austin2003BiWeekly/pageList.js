  var stagewidth;
  var stageheight;
  var keywordlist;
  var height;
  var width;
  function initKeywordList(){
    var newslength = [];
    dataset.forEach(function(data){
      newslength.push(data.length);
    })
    var maxlength = d3.max(newslength);
    var height = 800;
    var width = 800;
    if(d3.selectAll("#mainStage")[0].length != 0){

      var div = d3.select("#mainStage");
      var column = [timeunit];

      dataset.forEach(function(data, index){
        var currentcolom = [timeunit[index]];

        var newstable = div.append("table")
        .attr("id","newstable")
        .style("background-color","#FAFAFA")
        .style("float","left")
        .style("width", "180px")//((width / dataset.length) - 10) + 
        .style("height", height + "px")
        .style("margin-left","1px")
        .style("border-collapse","collapse")
        var newsthead = newstable.append("thead");
        var newsbody = newstable.append("tbody");

        newsthead.append("tr")
        .selectAll("th")
        .data(currentcolom)
        .enter()
        .append("th")
        .text(function(d){return d;})
        .style("font-family", "Arial Black")
        .style("font-size","13px")
        .attr("id","tableheader")


        
        var newdata = jQuery.extend(true, [], data);
        if(newdata.length < maxlength){//help to resize the structure of table
            for(var k = newdata.length; k < maxlength; k++){
              if(k % 2 == 0){
                newdata.push({"headline":" "});
              }else{
                newdata.push({"lead_paragraph":" "});
              }
              
            }
        }
        var trheight = (height / maxlength) + "px";
        var newsrows = newsbody.selectAll("tr")
        .data(newdata)
        .enter()
        .append("tr")
        .attr("id",function(d,i){
          if(d.headline == " " && d.lead_paragraph == undefined){
            return "notUse";
          }
          if(d.lead_paragraph == " " && d.headline == undefined){
            return "notUse";
          }
          if(i % 2 == 0){
            return "headline";
          }
          return "lead_paragraph";
        })
        .style("height",trheight);

        var newscells = newsrows.selectAll("td")
        .data(function(row, i){
               return column.map(function(column){
                if(i % 2 == 0){
                  return {value: row.headline}
                }else{
                  return {value: row.lead_paragraph}
                }
               })
        })
        .enter()
        .append("td" )

        var count = 0;
        newscells.selectAll("div")
        .data(function(row, i){
               return column.map(function(column){
                  return {value: row.value};
               })
        })
        .enter()
        .append("div")
        .style("height",function(d,g){
            if(count % 2 == 0){
              count++;
              return "50px";
            }else{
              count++;
              return "150px"
            }
            
        })
        .style("overflow-x","auto")
        .style("width","180px")
        .text(function(d,i){
          //console.log(d);
          return d.value;
        })
        //.style("color", function(d){return color(d.id)})
        //.style("font-family", "Arial Black")
    })

  }

}

  function keywordListAnimation(tempData, divg){
    if(d3.selectAll("#keywordlist")[0].length != 0){
      var keyworddata = jQuery.extend(true, [], tempData);
      var listwords = [];
      var wordlength = [];
      keyworddata.forEach(function(d,i){
          var tempkey = d.keywords;
          tempkey.forEach(function(g,i){
              g.id = d.id;
              wordlength.push(g.value.length);
          });
          listwords = listwords.concat(tempkey);
      });
      var maxLength = d3.max(wordlength);//get the max length of all keywords
      listwords.sort(function (a, b) {
          return b.occurrence - a.occurrence ;
      })
      listwords = listwords.filter(function(d,i){//filter out only ? top keywords
        return d.value != "";        
      })
      listwords = listwords.filter(function(d,i){//filter out only ? top keywords
        return i < 7;        
      })
      wordsizes = [];
      listwords.forEach(function(d,i){
          wordsizes.push(d.occurrence);
      });

      
      //console.log(newwords);

      var minSize = d3.min(wordsizes);
      var maxSize = d3.max(wordsizes);
      var firstScale = d3.scale.linear()
        .domain([minSize,maxSize])
        .range([0,1]);
      var sizeScale = d3.scale.pow().exponent(.8)
        .domain([firstScale(minSize),firstScale(maxSize)])
        .range([10,25]);

      if(oldData.length == 0){
        //No OLD DATA

          //.text("ABC")
          newtable.selectAll("tbody").remove();
          newtbody = newtable.append("tbody");

          newrows = newtbody.selectAll("tr")
          .data(listwords)
          .enter()
          .append("tr")
          .attr("width",cloudwidth / 2);

          newcells = newrows.selectAll("td")
          .data(function(row){
              return column.map(function(column){
                  return {column: column, value: row.value, id: row.id}
              })
          })
          .enter()
          .append("td")
          .text(function(d){
            // if(d.value.length > 17){
            // var left = d.value.substring(0, 17); 
            // var right = d.value.substring(17, d.value.length);
            // console.log(left + "-" + right);
            // return left + "-" + right;
            // }else{
              return d.value;
            //}
          
          })
          .style("color", function(d){return color(d.id)})
          .style("font-family", "Arial Black")
          .style("border", "1px solid")
          oldData = jQuery.extend(true, [], listwords);

      }else{
        var newwords = [];
        listwords.forEach(function(d){
          var check = true;
          oldData.forEach(function(g){
              if(g.id == d.id && g.value == d.value){
                check = false;
              }
          });
          if(check == true){
            newwords.push(d);
          }
        })

        newtable.selectAll("tbody").remove();
        d3.select("#oldlist").selectAll("tbody").remove();
          
          oldtbody = oldtable.append("tbody");
          oldrows = oldtbody.selectAll("tr")
          .data(oldData)
          .enter()
          .append("tr")
          .attr("width",cloudwidth / 2);

          oldcells = oldrows.selectAll("td")
          .data(function(row){
              return column.map(function(column){
                  return {value: row.value, id:row.id}
              })
          })
          .enter()
          .append("td" )
          .text(function(d){return d.value})
          .style("color", function(d){return color(d.id)})
          .style("font-family", "Arial Black")
          
          

          newtbody = newtable.append("tbody");

          newrows = newtbody.selectAll("tr")
          .data(listwords)
          .enter()
          .append("tr")
          .attr("width",cloudwidth / 2);

          newcells = newrows.selectAll("td")
          .data(function(row){
              return column.map(function(column){
                  return {column: column, value: row.value, id:row.id}
              })
          })
          .enter()
          .append("td")
          .text(function(d){return d.value})
          .style("color", function(d){return color(d.id)})
          .style("font-family", "Arial Black")
          .style("border", function(d){
             var check = false;
             newwords.forEach(function(g){
                if(d.id == g.id && d.value == g.value){
                  check = true;
                }
             })
             if(check == true){
                return "1px solid"
             }else{
                return "0px";
             }
          })
          oldData = []; 
          oldData = jQuery.extend(true, [], listwords);

      }

    }
    
  }
  // var fill = d3.scale.category20();
