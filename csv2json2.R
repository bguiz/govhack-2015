## This R code converts ATO/ABS data into r objects, processes it and exports to JSON
## Aplogies for the ugly R code, if you need help, please contact the devs.


library('jsonlite')
library('dplyr')



d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projNSW.csv',0)
# d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projVic.csv',0)
# d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projQLD.csv',0)
# d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projSA.csv',0)
# d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projACT.csv',0)
d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projWA.csv',0)
# d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projTAS.csv',0)
# d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/projNT.csv',0)


d = t(d)
# d.small = as.data.frame(d[c(1,6:18),seq(15,ncol(d),5)], stringsAsFactors = FALSE)
d.small = as.data.frame(d[c(1,6:17),15:ncol(d)], stringsAsFactors = FALSE)
d.all = as.data.frame(d[c(1,6:nrow(d)),15:ncol(d)], stringsAsFactors = FALSE)


names(d.small) = d.small[1,]
d.small=d.small[2:nrow(d.small),]
names(d.all) = d.all[1,]
d.all=d.all[2:nrow(d.all),]

head(d.small)

#AGE x #FUTURE YEAR
sizeFactor = 250
d.small2 = colSums(apply(d.small,2,as.integer))
# d.small3 = colSums(d.small2)

# nKids = 
# nsw.school = round((d.small2-d.small2[1])/sizeFactor*2) # new 5year olds for school M and F
# vic.school = round((d.small2-d.small2[1])/sizeFactor*2) # new 5year olds for school M and F
# qld.school = round((d.small2-d.small2[1])/sizeFactor*2)# new 5year olds for school M and F
# sa.school = round((d.small2-d.small2[1])/sizeFactor*2) # new 5year olds for school M and F
# nt.school = round((d.small2-d.small2[1])/sizeFactor*2) # new 5year olds for school M and F
# act.school =round((d.small2-d.small2[1])/sizeFactor*2) # new 5year olds for school M and F
wa.school = round((d.small2-d.small2[1])/sizeFactor*2)# new 5year olds for school M and F
# tas.school = round((d.small2-d.small2[1])/sizeFactor*2) # new 5year olds for school M and F


x = as.data.frame(cbind(nsw.school,vic.school,qld.school,sa.school,nt.school,act.school,wa.school,tas.school))
xx = labels(x)
yy = labels(x)
x = cbind(xx[[1]],x)
names(x) = c('year',yy[[2]])

x$logical = 1:nrow(x) ## dummy data
x.melt = melt(x,id = c('year','logical')) # ot entirely essential
names(x.melt) = c('year','var1','var2','schools')
listSplit <- split(x.melt[2:4],x.melt[1],drop=T)
# toJSON(listSplit, pretty=TRUE,dataframe = c('row'))
# write(j, "schoolsToBuild.json")


# listSplit <- split(x.melt[2:8],x.melt[1],drop=T)
listSplit2 = lapply(listSplit,splitLoop)

splitLoop = function(d){
x.m = melt(d)
# names(x.m) = c('schools','variable')
d = as.data.frame(d)
y = split(d[c(1,3)],d[2],drop=T)
return(y)}

j = toJSON(listSplit2, pretty=TRUE,dataframe = c('row'))
write(j, "schoolsToBuildTime.json")




#### % 0-5 yr old year by year in NSW


d = read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/growthandyouthNSW.csv',1)
d[2,] = d[2,]/.9

d.pop= read.csv('/Users/tparis/Proj/BoldVoyageData/GovHack/NSW_pop.csv',1)
d.pop2 = d.pop[!is.na(d.pop$x.3),]


d.pop2$loc = paste0(d.pop2$x,'0',d.pop2$x.1,'0',d.pop2$x.2,d.pop2$x.3)
d.pop2$GROWTH10  = as.numeric(as.matrix(d.pop2$GROWTH10))
  
head(d.pop2)

d.pop2.small = select(d.pop2,loc,X2015.00,GROWTH10)
d.pop2.growth = apply(d.pop2.small,1,location2growth)

popArray = NULL
sTime = NULL
for (i in 1:nrow(d.pop2.small)){
  l=d.pop2.small$loc[i]
  p=as.double(as.matrix((d.pop2.small$X2015[i])))
  g=as.double(as.matrix(d.pop2.small$GROWTH10[i]))
  growthArray = d[2,]*g
  loc = d.pop2.small$loc[i]
  pTime=NULL
  for (j in 1:length(growthArray)){
   pTime[j] =  as.numeric(p*(1+growthArray[j]/100)^j-p)
  }
  sTime =(pTime*2*0.05/213)
#   popArray = growthArray*p
#   popArray[i,1] = d.pop2.small$loc[i] 
  popArray = rbind(popArray,as.integer(round(sTime[2:length(sTime)])))
}

popArray2 = as.data.frame(popArray)
popArray2$loc = d.pop2.small$loc


location2growth = function(x){
# i = 1
l=x[1]
p=as.double(as.matrix((x[2])))
g=as.double(as.matrix(x[3]))
growthArray = d[2,]*g
popArray = growthArray*p
return(popArray)}
# i = 1
# l=x$loc[i]
# p=as.double(as.matrix((x$X2015[i])))
# g=as.double(as.matrix(x$GROWTH10[i]))
# growthArray = d[2,]*g
# popArray = growthArray*p


#JSON
x = as.data.frame(t(popArray2))
names(x) = d.pop2.small$loc
x$year = 2014:2061
x = x[2:nrow(x),]

listSplit <- split(x[2:ncol(x)-2],x[ncol(x)],drop=T)
# listSplit <- split(x.melt[2:8],x.melt[1],drop=T)
listSplit2 = lapply(listSplit[1:length(listSplit)-1],splitLoop)

# d = listSplit[[1]]
# x.m = melt(t(d))
# x.m = x.m[c(1,3)]
# names(x.m) = c('loc','schools')
# x.m[2] = apply(x.m[2],1,as.integer)
# y = split(x.m[c(2)],x.m[1])
# toJSON(y, pretty=TRUE,dataframe = c('row'))

splitLoop = function(d){
  x.m = melt(t(d))
  x.m = x.m[c(1,3)]
  names(x.m) = c('loc','schools')
  x.m[2] = apply(x.m[2],1,as.integer)
#   x.m[is.na(x.m[2])] = replicate((is.na(x.m[2])),0)
  x.m[is.na(x.m)] <- 0
  y = split(x.m[c(2)],x.m[1])
  return(y)}

j = toJSON(listSplit2, pretty=TRUE,dataframe = c('row'))
j.ugly = toJSON(listSplit2, dataframe = c('row'))
j.ugly = gsub("[", "", j.ugly,fixed = T)
j.ugly = gsub("]", "", j.ugly,fixed = T)


write(j.ugly, "schoolsLocsYears2.json")



