#include <iostream>
#include <string>

using namespace std;

struct Node {
    string data;
    Node* next;
};

void addNode(Node** head, string value) {
    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = *head;
    *head = newNode;
    
    cout << "[LOG] Node added with value: " << value << "on the address: " << newNode << endl;
}

void displayList(Node* head) {
    cout << "\n--- MEMORY MAP LIST ---\n";
    Node* current = head;
}

void freeMemory(Node* head) {
    Node* current = head;
    while (current != nullptr) {
        Node* nextNode = current -> next;
        cout << "[DELETING] Freeing memory at address: " << current << endl;
        current = nextNode;
    }
}

int main(){
    Node* listHead = nullptr;
    
    cout << "Welcome to the Memory Map List!\n" << endl;

    addNode(&listHead, "Node 1");
    addNode(&listHead, "Node 2");
    addNode(&listHead, "Node 3");
    
    displayList(listHead);
    
    freeMemory(listHead);
    
    return 0;
}