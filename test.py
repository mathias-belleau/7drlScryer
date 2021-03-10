

def ConvertToRight(base):
    newRight = []
    for x in base:
        holder = []
        holder.append(x[1])
        holder.append(x[0])
        # holder = x
        holder[1] = holder[1] * -1
        newRight.append(holder)
    print("\nright: ") 
    print(newRight)

def ConvertToDown(base):
    newDown = []
    for x in base:
        holder = []
        holder = x
        holder[1] = holder[1]* -1
        newDown.append(holder)
    print("\ndown: ") 
    print(newDown)
    
def ConvertToLeft(base):
    newLeft = []
    for x in base:
        holder = []
        holder.append(x[1])
        holder.append(x[0])
        holder[0] = holder[0]* -1
        newLeft.append(holder)
    print("\nleft: ") 
    print(newLeft)

#base = [ [-1,1],[0,1],[1,1],[0,2]]
#base = [ [-1,1],[0,1],[1,1],[-1,2],[0,2],[1,2] ]
base = [ [-1,1],[0,1] ]
print("Up")
print(base)
ConvertToRight(base)
ConvertToDown(base)
ConvertToLeft(base)